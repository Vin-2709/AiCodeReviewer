
const aiService = require("../services/ai.service");
const githubService = require("../services/github.service");

module.exports.getReview = async (req, res) => {
    try {
        const { code, language, githubUrl } = req.body;
        
        let codeToReview = code;
        
        // If GitHub URL is provided, fetch the code from GitHub
        if (githubUrl && githubUrl.trim()) {
            try {
                const githubCode = await githubService.fetchGithubCode(githubUrl);
                codeToReview = githubCode;
            } catch (error) {
                return res.status(400).json({ 
                    error: "Failed to fetch code from GitHub", 
                    message: error.message 
                });
            }
        }
        
        // Validate that we have code to review
        if (!codeToReview || !codeToReview.trim()) {
            return res.status(400).json({ error: "Code or GitHub URL is required" });
        }
        
        // Generate review
        const response = await aiService(codeToReview, language);
        res.send(response);
        
    } catch (error) {
        console.error("Error in getReview:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
};