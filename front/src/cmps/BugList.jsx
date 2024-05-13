import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { userService } from "../services/user.service.js"

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const loggedinUser = userService.getLoggedinUser()

  function isAllowed(bug) {
    return (bug.owner && bug.owner._id === loggedinUser?._id) || loggedinUser?.isAdmin
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {isAllowed(bug) && <button onClick={() => { onRemoveBug(bug._id) }}>Remove Bug</button>}
            {isAllowed(bug) && <button onClick={() => { onEditBug(bug) }}>Edit Bug</button>}
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
