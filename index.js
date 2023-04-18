// Fetch the CSV file using Fetch API
fetch('data.csv')
    .then(response => response.text())
    .then(data => {
        // Parse the CSV data
        const rows = data.split('\n');
        const headers = rows[0].split(',');
        const jsonData = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            const rowData = {};
            for (let j = 0; j < headers.length; j++) {
                rowData[headers[j]] = row[j];
            }
            jsonData.push(rowData);
        }

        // Create Leaflet map
        const map = L.map('map').setView([30.91, 75.86], 11); // Set initial map view
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Add OpenStreetMap tile layer
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Define custom icon
        const customIcon = L.icon({
            iconUrl: 'coe.svg', // Specify the URL of the custom icon image
            iconSize: [20, 20], // Specify the size of the icon
            iconAnchor: [16, 16] // Specify the anchor point of the icon
        });
        const customIcon1 = L.icon({
            iconUrl: 'coe1.svg', 
            iconSize: [20, 20],
            iconAnchor: [16, 16]
        });
        const customIcon2 = L.icon({
            iconUrl: 'coe2.svg',
            iconSize: [20, 20],
            iconAnchor: [16, 16] 
        });
        const customIcon3 = L.icon({
            iconUrl: 'coe3.svg', 
            iconSize: [20, 20],
            iconAnchor: [16, 16]
        });
        const customIcon4 = L.icon({
            iconUrl: 'coe4.svg', 
            iconSize: [20, 20], 
            iconAnchor: [16, 16]
        });


        // Create a layer group for the markers
        const markerLayerGroup = L.layerGroup().addTo(map);
        const markerLayerGroup1 = L.layerGroup().addTo(map);
        const markerLayerGroup2 = L.layerGroup().addTo(map);
        const markerLayerGroup3 = L.layerGroup().addTo(map);
        const markerLayerGroup4 = L.layerGroup().addTo(map);
        const markerLayerGroup5 = L.layerGroup().addTo(map); 

    
        // Loop through the data and add markers to the layer group with custom icon
        for (let i = 0; i < jsonData.length; i++) {
            // Check for valid latitude and longitude values
            if (jsonData[i].lat !== undefined && jsonData[i].lon !== undefined &&
                !isNaN(jsonData[i].lat) && !isNaN(jsonData[i].lon)) {
                const lat = parseFloat(jsonData[i].lat); // Convert latitude string to number
                const lon = parseFloat(jsonData[i].lon); // Convert longitude string to number
                let icon;
                const severityScore = parseInt(jsonData[i].Severity_Score); // Convert severity score string to number
                // Set icon based on severity score range
                if (severityScore >= 1 && severityScore <= 47) {
                    icon = customIcon;
                    markerLayerGroup1.addLayer(L.marker([lat, lon], { icon }));
                } else if (severityScore >= 48 && severityScore <= 55) {
                    icon = customIcon1;
                    markerLayerGroup2.addLayer(L.marker([lat, lon], { icon }));
                } else if (severityScore >= 56 && severityScore <= 63) {
                    icon = customIcon2;
                    markerLayerGroup3.addLayer(L.marker([lat, lon], { icon }));
                } else if (severityScore >= 64 && severityScore <= 84) {
                    icon = customIcon3;
                    markerLayerGroup4.addLayer(L.marker([lat, lon], { icon }));
                } else {
                    icon = customIcon4;
                    markerLayerGroup5.addLayer(L.marker([lat, lon], { icon }));
                }
                const marker = L.marker([lat, lon], { icon: icon }).addTo(markerLayerGroup, markerLayerGroup1, markerLayerGroup2, markerLayerGroup3, markerLayerGroup4, markerLayerGroup5); // Add marker to layer group with custom icon
                marker.bindPopup(`<b>${jsonData[i].title}</b><br>${jsonData[i].description}`); // Add popup with data
            }
        }

    // Add the layer groups to the map as separate layers with a control to toggle them on/off
     const overlayMaps = {
        'Markers': markerLayerGroup,
        'Severity score 1-46': markerLayerGroup1,
        'Severity score 47-55': markerLayerGroup2,
        'Severity score 56-63': markerLayerGroup3,
        'Severity score 64-84': markerLayerGroup4,
        'Severity score 84-130': markerLayerGroup5,

      };
      L.control.layers(null, overlayMaps).addTo(map);
  
      // Fit the map bounds to the markers
    //   const bounds = markerLayerGroup1.getBounds().extend(markerLayerGroup2.getBounds());
    //   map.fitBounds(bounds);
    })
    .catch(error => {
        console.error('Error fetching CSV file:', error);
    });
