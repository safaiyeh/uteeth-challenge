import { useEffect, useState } from 'react';
import './App.css';

const SEARCH_ENDPOINT = (term) => `http://127.0.0.1:8080/?search=${term}`;
function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const filterAndSortResults = (data) =>{
      const filteredData = data.filter(d => d.name.includes(searchTerm) || d.email === searchTerm);
      filteredData.sort((a, b) => {
        const aNameContainsTerm = a.name.split(' ').includes(searchTerm);
        const bNameContainsTerm = b.name.split(' ').includes(searchTerm);

        if (aNameContainsTerm && !bNameContainsTerm) return -1;
        if (bNameContainsTerm && !aNameContainsTerm) return 1;

        if (a.email === searchTerm) return -1;
        if (b.email === searchTerm) return 1;

        return 0;
      });

      return filteredData;
    }

    let requestValid = true;
  
    if (searchTerm.trim() !== '') {
      fetch(SEARCH_ENDPOINT(searchTerm))
      .then(response => response.json())
      .then(data => {
        if (requestValid) {
          console.log(data)
          setResults(filterAndSortResults(data))
        }
      });
    } else if (requestValid) {
      setResults([]);
    }

    return () => requestValid = false;
  }, [searchTerm]);

  return (
    <>
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.currentTarget.value)} />
      <Results results={results} />
    </>
  )
}

function Results({ results }) {
  const [selected, setSelected] = useState('');

  const onResultClick = (key) => {
    if (selected === key) {
      setSelected('')
    } else {
      setSelected(key)
    }
  }

  useEffect(() => setSelected(''), [results]);
  
  return <>
    {
      results.map(result => (
        <div key={result.id} style={{ backgroundColor: result.id === selected ? 'teal': 'white' }} onClick={() => onResultClick(result.id)}>
          <h2>{result.name}</h2>
          <p>{result.email}</p>
        </div> 
      ))
    }
  </>
}

function App() {
  return (
    <div className="App">
      <Search />
    </div>
  );
}

export default App;
