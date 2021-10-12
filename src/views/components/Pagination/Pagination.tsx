import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

interface Props {
  currentPage: number
  lastPage: number
  setCurrentPage: (page: number) => void
}

const Pagination: React.FC<Props> = ({ currentPage, lastPage, setCurrentPage }: Props) => {
  const getPaginationItems = (lastPage: number, currentPage: number) => {
    let items = []
    for (let i = 1; i <= lastPage; i++) {
      items.push(
        <CPaginationItem active={i === currentPage} onClick={() => setCurrentPage(i)} key={i}>
          {i}
        </CPaginationItem>,
      )
    }

    return items
  }

  return (
    <CPagination align="end" aria-label="pagination">
      <CPaginationItem
        aria-label="Previous"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>

      {getPaginationItems(lastPage, currentPage)}

      <CPaginationItem
        aria-label="Next"
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
