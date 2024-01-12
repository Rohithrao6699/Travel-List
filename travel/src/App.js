import { useState } from "react";
import "./App.css";

function App() {
  const [Items, setItems] = useState([]);

  function handleAddItems(items) {
    setItems((item) => [...item, items]);
    console.log(Items);
  }
  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function onToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleclearList() {
    const confirmed = window.confirm(
      "Are you sure, you want to clear the list?"
    );
    if (confirmed === true) {
      setItems([]);
    }
  }

  return (
    <div className="App">
      <Header />
      <Form handleAddItems={handleAddItems} />
      <List
        Items={Items}
        handleDeleteItems={handleDeleteItems}
        onToggle={onToggle}
        handleclearList={handleclearList}
      />
      <Footer items={Items} />
    </div>
  );
}
export default App;

function Header() {
  return <h1>🌴TRAVEL LIST</h1>;
}

function Form({ handleAddItems }) {
  const [description, setdescription] = useState("");
  const [quantity, setquantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;
    const NewItems = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };
    handleAddItems(NewItems);

    setdescription("");
    setquantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip 🤔 ?</h3>
      <select
        value={quantity}
        onChange={(e) => setquantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        placeholder="type here.."
        type="text"
        value={description}
        onChange={(e) => setdescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function List({ Items, handleDeleteItems, onToggle, handleclearList }) {
  const [sortby, setsortby] = useState("input");

  let sortedItems;

  if (sortby === "input") sortedItems = Items;

  if (sortby === "description") {
    sortedItems = Items.slice().sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  }

  if (sortby === "packed") {
    sortedItems = Items.slice().sort(
      (a, b) => Number(a.packed) - Number(b.packed)
    );
  }
  return (
    <div className="list">
      <ul>
        {sortedItems.map((items) => (
          <Item
            item={items}
            key={items.id}
            handleDeleteItems={handleDeleteItems}
            onToggle={onToggle}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortby} onChange={(e) => setsortby(e.target.value)}>
          <option value="input">Set by input</option>
          <option value="description">Set by description</option>
          <option value="packed">Set by packed status</option>
        </select>
        <button onClick={handleclearList}>clear list</button>
      </div>
    </div>
  );
}

function Item({ item, handleDeleteItems, onToggle }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggle(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity}-{item.description}
      </span>
      <button onClick={() => handleDeleteItems(item.id)}>❌</button>
    </li>
  );
}

function Footer({ items }) {
  if (!items.length)
    return (
      <p className="stat">
        <em>Start adding items to your list! ✈️</em>
      </p>
    );
  const numitem = items.length;
  const numpacked = items.filter((item) => item.packed).length;
  const numpercent = Math.round((numpacked / numitem) * 100);
  return (
    <footer className="stat">
      <em>
        {numpercent === 100
          ? "You are packed and ready to go ✈️"
          : `You have ${numitem} items on your list, you packed ${numpacked}(
        ${numpercent}%)`}
      </em>
    </footer>
  );
}
