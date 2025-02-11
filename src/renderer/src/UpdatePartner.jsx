import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router";

const ipcr = window.electron.ipcRenderer;

export default function UpdatePartner() {
  useEffect(() => { document.title = 'Обновить партнера' }, [])
  const location = useLocation();
  const [partner, setPartner] = useState(location.state.partner);
  const [orgTypes] = useState(location.state.orgTypes);

  async function submitHandler(e) {
    e.preventDefault()
    const updPartner = {
      id: partner.id,
      orgTypeId: e.target.type.value,
      name: e.target.name.value,
      director: e.target.director.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      inn: e.target.inn.value,
      address: e.target.address.value,
      rating: e.target.rating.value
    }
    await ipcr.invoke('updatePartner', updPartner);
    setPartner(updPartner);
    //document.querySelector('form').reset()
  }

  return <div className="form">
    <Link to={'/'}><button>{"<-- Назад"}</button></Link>
    <h1>Обновить партнера</h1>
    <form onSubmit={(e) => submitHandler(e)}>
      <label htmlFor="name">Наименование:</label>
      <input id="name" type="text" required defaultValue={partner.name} />
      <label htmlFor="type">Тип партнера:</label>
      <select name="orgTypes" id="type" required defaultValue={partner.org_type_id}>
        {orgTypes.map(orgType => <option key={orgType.id} value={orgType.id}>{orgType.name}</option>)}
      </select>
      <label htmlFor="rating">Рейтинг:</label>
      <input id="rating" type="number" step="1" min='0' max='100' required defaultValue={partner.rating}/>
      <label htmlFor="address">Адрес:</label>
      <input id="address" type="text" required defaultValue={partner.address} />
      <label htmlFor="director">ФИО директора:</label>
      <input id="director" type="text" required defaultValue={partner.director} />
      <label htmlFor="phone">Телефон:</label>
      <input id="phone" type="tel" required defaultValue={partner.phone} />
      <label htmlFor="inn">ИНН:</label>
      <input id="inn" type="text" required defaultValue={partner.inn} />
      <label htmlFor="email">Email компании:</label>
      <input id="email" type="email" required defaultValue={partner.email}/>
      <button type="submit">Обновить партнера</button>
    </form>
  </div>
}