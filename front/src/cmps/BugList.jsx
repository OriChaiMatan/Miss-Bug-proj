import { userService } from "../services/user.service.js"
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const loggedinUser = userService.getLoggedinUser()

  function isAllowed(bug) {
    return bug.owner._id === loggedinUser?._id || loggedinUser?.isAdmin
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {isAllowed(bug) && <button onClick={() => { onRemoveBug(bug._id) }}>Remove Bug</button>}
            {isAllowed(bug) && <button onClick={() => { onEditBug(bug) }}>Edit Bug</button>}
            <Link to={`/bug/${bug._id}`}>Details</Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
