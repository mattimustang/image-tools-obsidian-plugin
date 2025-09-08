import ImageText from "./image-text";

export default class MDText {
        text: string

        constructor(text: string) {
                this.text = text
        }

        getImageIndexes(imgText: string | null): [number, number] {
                if (!imgText) {
                        return [-1, -1]
                }

                if (this.isLocalImage(imgText)) {
                        return this.getLocalImageIndexes(imgText)
                }

                if (this.isUrlImage(imgText)) {
                        return this.getUrlImageIndexes(imgText)
                }

                return [-1, -1]
        }

        isLocalImage(imgText: string | null) {
                if (!imgText) {
                        return false
                }
                return this.text.indexOf(`![[${imgText}`) !== -1
        }

        isUrlImage(imgText: string | null) {
                if (!imgText) {
                        return false
                }
                const regex = new RegExp(`!\\[.+\\]\\(${imgText}\\)`)
                const match = this.text.match(regex)
                return !!match
        }

        getLocalImageIndexes(imgText: string): [number, number] {
                const indexStart = this.text.indexOf(`![[${imgText}`)
                let indexEnd = indexStart
                for (let i = indexStart + 1; i < this.text.length; i++) {
                        if (this.text[i] === "]" && this.text[i+1] === "]") {
                                indexEnd = i + 2
                                break
                        }
                }
                return [indexStart, indexEnd]
        }

        getUrlImageIndexes(imgText: string): [number, number] {
                const regex = new RegExp(`!\\[.+\\]\\(${imgText}\\)`)
                const match = this.text.match(regex)

                if (match && match.index !== undefined) {
                        return [match.index, match.index + match[0].length]
                }

                return [-1, -1]
        }

        getImageText(imgText: string | null) {
                const [indexStart, indexEnd] = this.getImageIndexes(imgText)
                if (indexStart === -1 || indexEnd === -1 || indexStart >= indexEnd) {
                        return undefined
                }
                return new ImageText(this.text.slice(indexStart, indexEnd))
        }
}
