import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';

const FamilyTree = ({ filePath = '/data/marojuFamilyTree_Rev1.json' }) => {
    const [familyData, setFamilyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState(new Set(['Somanna (Regulavalasa Tatayya)', 'Chinnayya', 'Somanna', 'Sanyasi']));

    useEffect(() => {
        const loadFamilyData = async () => {
            try {
                console.log('Attempting to load file:', filePath);
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Parsed data:', data);
                setFamilyData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading family tree data:', err);
                setError(`Error loading family tree data: ${err.message}`);
                setLoading(false);
            }
        };

        loadFamilyData();
    }, [filePath]);

    const toggleNode = (name) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(name)) {
                newSet.delete(name);
            } else {
                newSet.add(name);
            }
            return newSet;
        });
    };

    const renderNode = (node, level = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.name);
        const paddingLeft = `${level * 2}rem`;

        const nodeColor = node.Sex === 'Male' ? 'bg-blue-100' : 'bg-pink-100';
        const borderColor = node.Sex === 'Male' ? 'border-blue-300' : 'border-pink-300';

        return (
            <div key={node.name} className="font-sans">
                <div
                    className={`flex items-center p-2 my-1 rounded-lg border ${nodeColor} ${borderColor} hover:shadow-md transition-shadow duration-200`}
                    style={{ marginLeft: paddingLeft }}
                >
                    {hasChildren && (
                        <button
                            onClick={() => toggleNode(node.name)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded-full"
                        >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )}
                    <User size={16} className="mr-2" />
                    <div className="flex-1">
                        <span className="font-medium">{node.name}</span>
                        {node.Spouse && (
                            <span className="text-gray-600 text-sm ml-2">
                ♥ {node.Spouse}
              </span>
                        )}
                        {node.otherInfo && (
                            <div className="text-gray-500 text-xs mt-1">
                                {node.otherInfo}
                            </div>
                        )}
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="ml-4">
                        {node.children.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl font-semibold text-gray-600">Loading family tree data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!familyData) {
        return (
            <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">No Data Available</h2>
                <p>Unable to load family tree data. Please check if the file exists.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Maroju Family Tree</h1>
            <div className="mb-4 p-2 bg-gray-100 rounded-lg text-sm">
                <p className="mb-1">🔵 Male members are shown in blue</p>
                <p>🌸 Female members are shown in pink</p>
            </div>
            <div className="overflow-x-auto">
                {renderNode(familyData)}
            </div>
        </div>
    );
};

export default FamilyTree;