// src/components/SearchBar.tsx

import {useState} from "react";
import { TextField, Button } from "@mui/material";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <TextField 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                variant="outlined"
                size="small"
                style={{ width: '200px' }}
            />
            <Button onClick={handleSearch} variant="contained" color="primary" style={{ height: '40px' }}>
                Search
            </Button>
        </div>
    );
};

export default SearchBar;