import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { bugService } from "../services/bug.service.js"

export function BugEdit() {

    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.bugId) loadBug()
    }, [])

    async function loadBug() {
        try {
            const bugToEdit = await bugService.get(params.bugId)
            setBugToEdit(bugToEdit)
        } catch (err) {
            console.log('err:', err)
        }
    }

    function handleChange({ target }) {
        const { value, name, type, checked } = target
        const [fieldName, nestedField] = name.split('.')

        if (type === 'checkbox') {
            let updatedLabels
            if (checked) {
                updatedLabels = [...bugToEdit.labels, value]
            } else {
                updatedLabels = bugToEdit.labels.filter((label) => label !== value)
            }
            setBugToEdit((prevBug) => ({ ...prevBug, labels: updatedLabels }))
        } else if (nestedField === 'imgUrls') {
            setBugToEdit((prevBug) => ({
                ...prevBug,
                [fieldName]: {
                    ...prevBug[fieldName],
                    ...value
                }
            }))
        } else if (nestedField) {
            setBugToEdit((prevBug) => ({
                ...prevBug,
                [fieldName]: {
                    ...prevBug[fieldName],
                    [nestedField]: value
                }
            }));
        } else {
            setBugToEdit((prevBug) => ({ ...prevBug, [fieldName]: value }))
        }
    }

    async function onSaveBug(ev) {
        ev.preventDefault()
        try {
            bugService.save(bugToEdit)
            navigate('/bug')
        } catch (err) {
            console.log('err:', err)
        }
    }
    const { title, description, severity, labels } = bugToEdit

    return (
        <section className="bug-edit">
            <form onSubmit={onSaveBug} >
                <label htmlFor="tilte">Title:</label>
                <input onChange={handleChange} value={title} type="text" name="title" id="title" />

                <label htmlFor="description">Description:</label>
                <input onChange={handleChange} value={description} type="text" name="description" id="description" />

                <label htmlFor="severity">Severity:</label>
                <input onChange={handleChange} value={severity} type="number" name="severity" id="severity" />

                <div className="labels">
                    <label htmlFor="labels">Choose Labels:</label>
                    <span><input type="checkbox" name="labels" value="critical" onChange={handleChange} /> critical</span>
                    <span><input type="checkbox" name="labels" value="need-CR" onChange={handleChange} /> need-CR</span>
                    <span><input type="checkbox" name="labels" value="dev-branch" onChange={handleChange} /> dev-branch</span>
                </div>

                <button>Save</button>
            </form>
        </section>
    )
}