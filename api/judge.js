export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    try {
        const body = JSON.parse(req.body);
        const { word, prevWord, requiredLength } = body;
        const prompt = `あなたは「限界しりとり」の審判です。直前の言葉「${prevWord}」に対し、今回の入力「${word}」はルール（${requiredLength}文字、しりとり成立、実在する）に適していますか？JSON形式で {"is_valid": true, "reason": "OK"} または {"is_valid": false, "reason": "理由"} で答えてください。`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const jsonMatch = rawText.match(/\{.*\}/s);
        res.status(200).json(JSON.parse(jsonMatch[0]));
    } catch (error) {
        res.status(500).json({ is_valid: false, reason: "エラー発生" });
    }
}
