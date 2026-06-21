const resources = require("../data/resources");

const getResources = (req, res) => {

  const roadmap =
    req.params.roadmap.toLowerCase();

  const roadmapResources =
    resources[roadmap];

  if (!roadmapResources) {
    return res.status(404).json({
      success: false,
      message: "Resources not found"
    });
  }

  res.status(200).json({
    success: true,
    data: roadmapResources
  });

};

module.exports = {
  getResources
};