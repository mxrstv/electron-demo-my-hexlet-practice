import { useEffect, useState } from "react"
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png'

const ipcr = window.electron.ipcRenderer;

function App() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await ipcr.invoke('getPartners')
      setPartners(res)
    })()
  }, [])
  const [orgTypes, setOrgTypes] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await ipcr.invoke('getOrgTypes')
      setOrgTypes(res)
    })()
  }, [])
  // console.log(orgTypes)

  return (
    <>
      <div className="page-heading">
        <img className="page-logo" src={logo} alt="" />
        <h1>Партнеры</h1>
      </div>
      <Link to='/create' state={{ orgTypes}}>
        <button>
          Создать партнера
        </button>
      </Link>
      <ul className="partners-list">
        {partners.map((partner) => {
          return <li className="partner-card" key={partner.id} onClick={() => { navigate('/update', { state: { partner, orgTypes } }) }}>
            <div className="partner-data">
              <p className="card_heading">{partner.org_type} | {partner.name}</p>
              <div className="partner-data-info">
                {/* <p>ИНН: {partner.inn}</p> */}
                <p>{partner.director}</p>
                <p>{partner.phone}</p>
                <p>Рейтинг: {partner.rating}</p>
              </div>
            </div>
            <div className="partner-sale partner-data card_heading">
              {partner.discount}%
            </div>
          </li>
        })}
      </ul>
    </>
  )
}

export default App
