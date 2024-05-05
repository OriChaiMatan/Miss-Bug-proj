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
    
        setFilterByToEdit(prevFilter => {
            console.log("filterby",{ ...prevFilter, [field]: value })
            return { ...prevFilter, [field]: value }
        });
    }
    


    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }


    const { title, severity, label, sortBy, sortDir } = filterByToEdit
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

                {/* <label htmlFor="sortBy">Sort By: </label>
                <select value={sortBy} onChange={handleChange} id="sortBy" name="sortBy">
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>

                <label htmlFor="sortDir">Sort Direction: </label>
                <select value={sortDir} onChange={handleChange} id="sortDir" name="sortDir">
                    <option value="1">Ascending</option>
                    <option value="-1">Descending</option>
                </select> */}

                <button>Set Filter</button>
            </form>
        </section>
    )
}