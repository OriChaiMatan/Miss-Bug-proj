async function onGetUsers() {
    const elPre = document.querySelector('pre')
    const res = await fetch('api/user')
    const users = await res.json()

    elPre.innerText = JSON.stringify(users, null, 2)
}