import { useState } from 'react'
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugPreview } from '../cmps/BugPreview.jsx'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export function UserDetails() {

    const [bugs, setBugs] = useState([])
    const loggedinUser = userService.getLoggedinUser()

    useEffect(() => {
        fetchData()
      }, [])
    
      async function fetchData() {
        try {
          const bugs = await bugService.query()
          setBugs(bugs)
        } catch (err) {
          console.log('err:', err)
        }
      }

    function isAllowed(bug) {
        return (bug.owner && bug.owner._id === loggedinUser?._id) || loggedinUser?.isAdmin
    }
    const filteredBugs = bugs.filter(isAllowed)

    return (
        <section>
            <h1>Username: {loggedinUser.fullname}</h1>
            <h2>My Bug-list:</h2>
            <ul className="bug-list">
                {filteredBugs.map((bug) => (
                     <li className="bug-preview" key={bug._id}>
                        <BugPreview bug={bug} />
                        <div>
                            <button onClick={() => { onRemoveBug(bug._id) }}>Remove Bug</button>
                            <button onClick={() => { onEditBug(bug) }}>Edit Bug</button>
                        </div>
                        <Link to={`/bug/${bug._id}`}>Details</Link>
                    </li>
                ))}
            </ul>
        </section>
    )

}

