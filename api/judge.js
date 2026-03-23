export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    try {
        const { word, prevWord, requiredLength } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `{"word":"${word}","prevWord":"${prevWord}"} を判定して。ルールは(${requiredLength}文字、実在、しりとり)。必ず以下のJSONのみを出力せよ：{"is_valid": true, "reason": "OK"}` }] 
                }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        // 【重要】最初の { から 最後の } までを強引に切り出す
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}');
        const jsonString = rawText.substring(start, end + 1);
        
        res.status(200).json(JSON.parse(jsonString));
    } catch (error) {
        res.status(500).json({ is_valid: false, reason: "AIの答えがJSONではありませんでした" });
    }
}
