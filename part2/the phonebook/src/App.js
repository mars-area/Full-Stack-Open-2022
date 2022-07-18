import { useState, useEffect } from "react";

import "./index.css";
import { create, getAll, remove, update } from "./apis/index";

const PersonForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number:{" "}
        <input value={props.phoneNumber} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = (props) => {
  const filteredPersons = props.persons.filter((person) =>
    person.name.toLowerCase().includes(props.search.toLowerCase())
  );
  return (
    <>
      {filteredPersons.map((person) => {
        return (
          <div key={person.name}>
            <div>
              {person.name} {person.number}
            </div>
            <button onClick={() => props.onDelete(person.id, person.name)}>
              delete
            </button>
          </div>
        );
      })}
    </>
  );
};

const Filter = (props) => {
  return (
    <div>
      <p>
        <input onChange={(e) => props.setQuery(e.target.value)} />
      </p>
    </div>
  );
};

const Notification = (props) => {
  if (props.message) {
    return (
      <div
        className={`notification__container ${
          props.notifType === "success" ? "success" : "error"
        }`}
      >
        {props.message}
      </div>
    );
  }

  return null;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [notifType, setNotifType] = useState("");
  const [query, setQuery] = useState("");

  function notify(type, message) {
    setNotifType(type);
    setMessage(message);
    setTimeout(() => {
      setMessage("");
      setNotifType("");
    }, 5000);
  }

  const clearState = () => {
    setNewName("");
    setPhoneNumber("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newName || !phoneNumber) {
      return alert("Please fill in all fields");
    }

    if (persons.find((person) => person.name === newName)) {
      // return alert(`${newName} is already added to phonebook`);
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        update(persons.find((person) => person.name === newName).id, {
          name: newName,
          number: phoneNumber,
        })
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.name === newName ? response.data : person
              )
            );
            notify("success", `${newName} has been updated`);
            clearState();
          })
          .catch((error) => {
            if (error.response.status === 404) {
              notify("error", `Information of ${newName} has already been removed from server`);
            } else {
              notify("error", `Failed updating ${newName}`);
            }
            console.error(`Error updating ${newName}`, error);
          });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: phoneNumber,
      id: persons[persons.length - 1].id + 1,
    };

    create(newPerson)
      .then((response) => {
        setPersons((persons) => [...persons, newPerson]);
        notify("success", `${newPerson.name} has been added to phonebook.`);
        clearState();
      })
      .catch((error) => {
        notify("error", `Failed adding ${newPerson.name}`);
        console.error("Error creating new person - ", error);
      });
  };

  const handleDelete = (id, name) => {
    window.confirm(`Are you sure you want to delete ${name}?`) &&
      remove(id)
        .then(() => {
          setPersons((persons) => persons.filter((person) => person.id !== id));
          notify("success", `${name} has been deleted.`);
        })
        .catch((error) => {
          notify("error", `Failed deleting ${name}`);
          console.error(`Error deleting id: ${id} - `, error);
        });
  };

  useEffect(() => {
    getAll()
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter setQuery={setQuery} />

      <h3>add a new</h3>

      <Notification message={message} notifType={notifType} />

      <PersonForm
        newName={newName}
        phoneNumber={phoneNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setPhoneNumber(e.target.value)}
        handleSubmit={handleSubmit}
      />

      <h3>Numbers</h3>

      <Person persons={persons} search={query} onDelete={handleDelete} />
    </div>
  );
};

export default App;