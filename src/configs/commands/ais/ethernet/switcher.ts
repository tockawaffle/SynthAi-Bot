import axios from "axios";
import "dotenv/config";
export default async function switcher() {
    try {
        const check = await axios.get(process.env.GPTE_API! + "/ask", {
            params: {
                prompt: "Are you online? If so, please reply with only 'yes'!",
                model: "you",
            },
            timeout: 4000,
        });
        if ((check.data.text as string).toLowerCase().includes("yes")) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        return false;
    }
}
