import React from 'react';
import FamilyTree from './components/FamilyTree';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Maroju Family Tree</h1>
            <FamilyTree />
        </div>
    );
}

export default App;