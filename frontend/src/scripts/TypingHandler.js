fetch(`/languages/${localStorage.getItem("language")}`)
    .then(res => {
        return res.json()
    }).then(data => {
        let words
        words = data

        const wordCount = localStorage.getItem("wordCount") || 30
        let text = ""
        for (var i = 0; i < wordCount; i++) {
            let randomIndex = Math.floor(Math.random() * (words.length))
            let word = words[randomIndex]
            text = text + ` ${word}`
        }

        const sequenceElements = []
        let index = 1
        let playing = true
        let nextChar = text[index]

        const stats = {
            accuracy: 100,
            speed: 90,
            time: 0
        }

        // every quarter of a second the WPM stat will be decreased by 1
        /*
        const decaySpeed = () => {
            if (stats.speed > 0) {
                stats.speed--
                setTimeout(decaySpeed, 250)
            }
        }
        decaySpeed()
        */
        const tick = () => {
            stats.time++
            setTimeout(tick, 1000)
        }
        tick()

        // stats content
        const statsDiv = document.getElementById("stats")
        const accuracyStatP = document.getElementById("accuracyStat")
        const speedStatP = document.getElementById("speedStat")
        const timeStatP = document.getElementById("timeStat")

        // adding a mouse enter event listener to the sequence so it alerts the user what to do
        const sequenceParagraph = document.getElementById("sequence")
        let prompted = false
        sequenceParagraph.addEventListener("mouseenter", () => {
            if (prompted) return
            if (index == 0) {
                alert("Start typing to start the test.")
                prompted = true
            }
        })

        // looping through the text generated and creating the span tags for each letter that will show up on the page
        for (var i = 0; i < text.length; i++) {
            const span = document.createElement("letter")
            span.style.color = "white"
            span.style.fontFamily = "Montserrat"
            span.innerHTML = text[i]
            sequenceElements.push(span)
            sequenceParagraph.appendChild(span)
        }

        const displayStats = () => {
            stats.speed = wordCount / (stats.time / 0.6)

            statsDiv.style.visibility = "visible"
            speedStatP.innerHTML = `Speed: ${Math.round(stats.speed)} WPM`
            accuracyStatP.innerHTML = `Accuracy: ${stats.accuracy}%`

            let minutes = Math.floor(stats.time / 60)
            timeStatP.innerHTML = `Time: ${minutes}`
        }

        // when a key is pressed down we will check if it is the next character in the text sequence
        document.addEventListener("keydown", (event) => {
            if (!playing || event.ctrlKey || event.altKey) return
            let key = event.key

            switch (key) {
                case (nextChar):
                    const accuracy = stats.accuracy
                    if (accuracy < 100) stats.accuracy += 1.5

                    let element = sequenceElements[index]
                    element.id = "text-seen"
                    element.style.color = "orange"
                    element.style.fontFamily = "Montserrat"

                    index++
                    nextChar = text[index]
                    break
                case ("Backspace"):
                    if (index > 1) {
                        index--
                        nextChar = text[index]

                        let element = sequenceElements[index]
                        element.style.color = "white"
                        element.style.borderStyle = "none"
                    }
                    break
                case ("Enter"):
                    playing = false
                    displayStats()
                    break
                default:
                    let finalAccuracy = stats.accuracy
                    let finalElement = sequenceElements[index]
                    finalElement.style.color = "red"
                    finalElement.style.borderWidth = ".25px"

                    index++
                    nextChar = text[index]

                    if (finalAccuracy > 0 && finalAccuracy <= 100) stats.accuracy -= 2
            }

            if (index == text.length) {
                displayStats()
                playing = false
            }
        })
    }).catch(err => {
        console.warn(err)
    })