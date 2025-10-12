const axios = require('axios');
function parseGithubUrl(url) {
    try {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob|tree)\/[^\/]+\/(.+))?/;
        const match = url.match(regex);
        
        if (match) {
            return {
                owner: match[1],
                repo: match[2].replace('.git', ''),
                path: match[3] || ''
            };
        }
        return null;
    } catch (error) {
        throw new Error('Invalid GitHub URL format');
    }
}

// Fetch file content from GitHub
async function fetchFileContent(owner, repo, path) {
    try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const response = await axios.get(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AI-Code-Reviewer'
            }
        });
        
        if (response.data.type === 'file') {
            const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return {
                type: 'file',
                content,
                name: response.data.name,
                path: response.data.path
            };
        } else if (response.data.type === 'dir') {
            const files = [];
            
            for (const item of response.data) {
                if (item.type === 'file') {
                    const fileResponse = await axios.get(item.url, {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'AI-Code-Reviewer'
                        }
                    });
                    const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
                    files.push({
                        name: item.name,
                        content: fileContent,
                        path: item.path
                    });
                }
            }
            
            return {
                type: 'directory',
                files
            };
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Repository or file not found. Make sure the repository is public.');
            } else if (error.response.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }
        }
        throw new Error(`Failed to fetch from GitHub: ${error.message}`);
    }
}

// Main function to fetch code from GitHub URL
async function fetchGithubCode(url) {
    const parsed = parseGithubUrl(url);
    
    if (!parsed) {
        throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo or https://github.com/owner/repo/blob/branch/path');
    }
    
    try {
        const result = await fetchFileContent(parsed.owner, parsed.repo, parsed.path);
        
        if (result.type === 'file') {
            return result.content;
        } else if (result.type === 'directory') {
            let combinedCode = '';
            result.files.forEach((file, index) => {
                combinedCode += `// File: ${file.path}\n`;
                combinedCode += file.content;
                if (index < result.files.length - 1) {
                    combinedCode += '\n\n// ========================\n\n';
                }
            });
            return combinedCode;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    fetchGithubCode,
    parseGithubUrl,
    fetchFileContent
};