const { GoogleGenerativeAI } = require('@google/generative-ai');
const Map = require('../models/Map');
const { transformMapData } = require('./utils/transformData');
const { generateResources } = require('./utils/resourceGenerator');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildPrompt = (topic, level) => {
  return `
You are an expert curriculum designer. Generate a comprehensive learning map for the topic and level specified.
The output must be valid JSON only - no markdown, no code blocks, no explanations.

Topic: "${topic}"
Level: "${level}"

Rules:
1. Root object has: "id", "title", "description", "children"
2. Each child has: "id" (unique string like "1", "1.1", "1.2"), "title", "description", "children" array
3. Description: one concise sentence explaining the node's topic
4. Depth: ${level === 'Beginner' ? '2-3' : level === 'Intermediate' ? '3-4' : '4-5'} levels
5. Breadth: ${level === 'Beginner' ? '3-4' : level === 'Intermediate' ? '4-5' : '5-7'} items per parent
6. Return ONLY the JSON object - start with { and end with }

Example output for "Basic Photography":
{
  "id": "1",
  "title": "Basic Photography",
  "description": "Understanding the fundamentals of capturing and composing photographs.",
  "children": [
    {
      "id": "1.1",
      "title": "Camera Basics",
      "description": "Learn about camera types, sensors, and essential controls.",
      "children": [
        {
          "id": "1.1.1",
          "title": "Aperture",
          "description": "Understanding aperture, f-stops, and depth of field.",
          "children": []
        }
      ]
    }
  ]
}

Now generate the map for "${topic}" at ${level} level:
  `;
};

exports.generateMap = async (req, res, next) => {
  const { topic, level } = req.body;

  if (!topic?.trim() || !level) {
    return res.status(400).json({ 
      success: false,
      message: 'Topic and level are required.' 
    });
  }

  try {
    // Check cache
    let cachedMap = await Map.findOne({ topic: topic.trim(), level });
    
    if (cachedMap) {
      console.log('📦 Serving from cache');
      
      // Convert resources array back to object format for frontend
      const resourcesObj = {};
      cachedMap.resources.forEach(item => {
        resourcesObj[item.nodeId] = item.data;
      });

      return res.status(200).json({
        success: true,
        cached: true,
        nodes: cachedMap.flowNodes,
        edges: cachedMap.flowEdges,
        resources: resourcesObj,
      });
    }

    console.log(' Generating map via Gemini');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = buildPrompt(topic.trim(), level);

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Clean markdown if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let mapData;
    try {
      mapData = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to parse AI response. Please try again.' 
      });
    }

    // Transform for React Flow
    const { nodes, edges } = transformMapData(mapData);

    // Generate resources for each node
    console.log('📚 Generating resources...');
    const resourcesObj = await generateResources(nodes, topic);

    // Convert resources object to array format for MongoDB
    const resourcesArray = Object.entries(resourcesObj).map(([nodeId, data]) => ({
      nodeId,
      data,
    }));

    // Save to database
    const newMap = new Map({
      topic: topic.trim(),
      level,
      mapData,
      flowNodes: nodes,
      flowEdges: edges,
      resources: resourcesArray,
    });
    
    await newMap.save();

    console.log(' Map generated and cached');
    res.status(200).json({
      success: true,
      cached: false,
      nodes,
      edges,
      resources: resourcesObj,
    });

  } catch (error) {
    console.error('Map generation error:', error);
    next(error);
  }
};