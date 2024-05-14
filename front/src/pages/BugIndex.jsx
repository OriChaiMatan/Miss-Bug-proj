import { useCallback, useEffect, useState } from 'react'
import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { Link } from 'react-router-dom'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  const debouncedSetFilterBy = useCallback(utilService.debounce(onSetFilterBy, 1000), [])

  useEffect(() => {
    fetchData()
  }, [filterBy])

  async function fetchData() {
    try {
      const bugs = await bugService.query(filterBy)
      setBugs(bugs)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onChangePageIdx(pageIdx) {
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
}

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy} />
        <button className='add-btn'><Link to="/bug/edit" >Add Bug ⛐</Link></button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug}  />
      </main>
    </main>
  )
}
