const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const getCompletion = async message => {
    const response = await fetch("http://localhost:3000/api/chat", {// when  you deploy this to production, you will need to change this to the production URL
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error("Failed to get completion");
    }

    const data = await response.json();
    try{
        //Try to parse the response as JSON if it's a string
        const parsedResponse =
            typeof data.response === "string" 
                ? JSON.parse(data) 
                : data.response;
        return parsedResponse.response || parsedResponse;
    } catch (e) {
        //If parsing fails, return the original response 
        return data.response;;
    }  
};

class SuggestionOverlay {
    constructor() {
        this.overlay = document.createElement("div");
        this.overlay.className = "ai-suggestion-overlay";
            this.overlay.style.cssText = `
                position: absolute;
                pointer-events: none;
                color: #9CA3AF;
                font-family: monospace;
                white-space: pre;
                z-index: 10000;
                background: transparent;   
            `;

        document.body.appendChild(this.overlay);
    }

    show(element, suggestion, cursorPosition) {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);

        const measureSpan = document.createElement("span");
        measureSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            letter-spacing: ${computedStyle.letterSpacing};
            white-space: pre;
        `;
        measureSpan.textContent = element.value.substring(0, cursorPosition);
        document.body.appendChild(measureSpan);

        const textWidth = measureSpan.getBoundingClientRect().width;
        document.body.removeChild(measureSpan);

        this.overlay.style.top = `${rect.top + window.scrollY}px`;
        this.overlay.style.left = `${rect.left + window.scrollX + textWidth}px`; 
        this.overlay.style.height = computedStyle.lineHeight;
        this.overlay.style.padding = computedStyle.padding;
        this.overlay.style.fontSize = computedStyle.fontSize;
        this.overlay.style.fontFamily = computedStyle.fontFamily;
        this.overlay.style.letterSpacing = computedStyle.letterSpacing;
        this.overlay.lineHeight = computedStyle.lineHeight;


        // Only show the suggestion
        this.overlay.textContent = suggestion;
        this.overlay.style.display = "block";

    }

    hide() {
        this.overlay.style.display = "none";
    }
}

class AICompletion {
    constructor() {
        this.currentElement
    }
}