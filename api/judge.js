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
                    parts: [{ text: `
                        ルール: 直前の言葉「${prevWord}」に対して、入力「${word}」が (${requiredLength}文字、実在する言葉、しりとり成立) か判定せよ。
                        必ず{"is_valid": true/false, "reason": "理由"}の形式のJSONのみを出力せよ。他の文字は一切入れるな。` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        // テキストを取り出し、空白や改行を除去
        const text = data.candidates[0].content.parts[0].text.replace(/```json|```|\n/g, '').trim();
        
        res.status(200).json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ is_valid: false, reason: "通信エラー: AI応答がJSONではありませんでした" });
    }
}
