function editForm(id) {
    let elements = document.getElementsByClassName(id)
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.toggle("show")
    }
}

async function getValues(id) {
    let form = document.querySelectorAll(`#editedTask${id}`)
    console.log("form:", form)
    if (form[2][0].value == "") {
        return window.alert("Bitte füllen Sie alle Felder aus!")
    }
    const editedTask = {
        _id: id,
        day: form[0][0].value,
        month: form[0][1].value,
        notification: form[2][0].value,
        description: form[1][0].value
    }
    console.log(form[2][0])
    console.log("TASK:", editedTask)
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
