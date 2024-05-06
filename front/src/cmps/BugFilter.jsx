import { useEffect, useState } from "react"

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }



    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }


    const { title, severity, label, sortBy } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Title: </label>
                <input value={title} onChange={handleChange} type="text" placeholder="By title" id="title" name="title" />

                <label htmlFor="severity">Severity: </label>
                <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />

                <label htmlFor="label">Label: </label>
                <select value={label} onChange={handleChange} id="label" name="label">
                    <option value="all">All</option>
                    <option value="critical">Critical</option>
                    <option value="need-CR">Need-CR</option>
                    <option value="dev-branch">Dev-branch</option>
                </select>
                <button>Set Filter</button>

                <div className="sortBy">
                    <label htmlFor="sortBy">Sort By: </label>
                    <select value={sortBy} onChange={handleChange} id="sortBy" name="sortBy">
                        <option value="">Sort By</option>
                        <option value="Title">Title</option>
                        <option value="Severity">Severity</option>
                        <option value="CreatedAt">CreatedAt</option>
                    </select>
                </div>
            </form>
        </section>
    )
}