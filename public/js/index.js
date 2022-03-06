let elements = document.getElementsByClassName("editForm")
let form = document.querySelectorAll("#editedTask")

function editForm(id) {
    let elements = document.getElementsByClassName(id)
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.toggle("show")
    }
}

async function getValues() {
    if (form[2][0].value == "") {
        return window.alert("Bitte füllen Sie alle Felder aus!")
    } else {
        const editedTask = {
            _id: form[3].value,
            day: form[0][0].value,
            month: form[0][1].value,
            description: form[1][0].value,
            notification: form[2][0].value
        }
        url = "https://simpletaskml.herokuapp.com/edittask"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedTask)
        });
        this.window.location.reload()
    }
}