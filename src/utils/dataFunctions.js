import Papa from 'papaparse';

// Simple function to get top 15 vehicle makes
export async function getTop15Makes(setLoading) {
  if (setLoading) setLoading(true);
  
  try {
    // Fetch CSV data
    const response = await fetch('/Electric_Vehicle_Population_Data.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });

    const data = result.data;
    
    // Count vehicles by make
    const makeCounts = {};
    data.forEach(item => {
      const make = item.Make || 'Unknown';
      makeCounts[make] = (makeCounts[make] || 0) + 1;
    });

    // Convert to array, sort by count, and get top 15
    const topMakes = Object.entries(makeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    if (setLoading) setLoading(false);
    return topMakes;
    
  } catch (error) {
    if (setLoading) setLoading(false);
    throw error;
  }
}

// Simple function to get total count
export async function getTotalCount(setLoading) {
  if (setLoading) setLoading(true);
  
  try {
    const response = await fetch('/Electric_Vehicle_Population_Data.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });

    if (setLoading) setLoading(false);
    return result.data.length;
    
  } catch (error) {
    if (setLoading) setLoading(false);
    throw error;
  }
}
