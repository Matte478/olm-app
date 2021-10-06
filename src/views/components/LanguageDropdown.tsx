import { cifGb, cifSk, cilGlobeAlt } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { Placements } from '@coreui/react/dist/components/Types'
import i18next from 'i18next'
import React from 'react'

interface Props {
  placement?: Placements
}

interface LanguageItem {
  code: string
  name: string
  icon: any
}

const languages: LanguageItem[] = [
  {
    code: 'sk',
    name: 'Slovensky',
    icon: cifSk,
  },
  {
    code: 'en',
    name: 'English',
    icon: cifGb,
  },
]

const LanguageDropdown: React.FC<Props> = ({ placement }: Props) => {
  return (
    <CDropdown component="li" variant="nav-item" placement={placement}>
      <CDropdownToggle>
        <CIcon className="text-dark" content={cilGlobeAlt} size="xl" />
      </CDropdownToggle>
      <CDropdownMenu>
        {languages.map(({ code, name, icon }: LanguageItem) => (
          <CDropdownItem component="button" key={code} onClick={() => i18next.changeLanguage(code)}>
            <CIcon className="me-2" content={icon} size="2xl" />
            {name}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default LanguageDropdown
