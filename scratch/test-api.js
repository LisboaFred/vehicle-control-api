async function run() {
  try {
    
    // Create driver
    let res = await fetch('http://localhost:3000/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Driver' })
    });
    let data = await res.json();
    console.log('CREATE DRIVER:', data);
    
    const driverId = data.data.id;

    // Update driver
    res = await fetch(`http://localhost:3000/api/drivers/${driverId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Driver' })
    });
    data = await res.json();
    console.log('UPDATE DRIVER:', res.status, data);

    // Delete driver
    res = await fetch(`http://localhost:3000/api/drivers/${driverId}`, {
      method: 'DELETE'
    });
    console.log('DELETE DRIVER:', res.status);
    
    // Create Auto
    res = await fetch('http://localhost:3000/api/automobiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licensePlate: 'AAA-1234', color: 'Red', brand: 'Ford' })
    });
    data = await res.json();
    console.log('CREATE AUTO:', data);
    
    const autoId = data.data.id;

    // Update auto
    res = await fetch(`http://localhost:3000/api/automobiles/${autoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: 'Blue', brand: 'Honda' })
    });
    data = await res.json();
    console.log('UPDATE AUTO:', res.status, data);

    // Delete auto
    res = await fetch(`http://localhost:3000/api/automobiles/${autoId}`, {
      method: 'DELETE'
    });
    console.log('DELETE AUTO:', res.status);
    
  } catch (err) {
    console.error(err);
  }
}

run();
