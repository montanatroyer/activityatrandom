const DEFAULT_FIELD_MASK = [
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.currentOpeningHours',
  'places.location',
  'places.googleMapsUri',
  'places.businessStatus',
  'places.websiteUri'
].join(',');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Allow client to pass a custom fieldMask (e.g. geocode only needs places.location)
  const fieldMask = req.body.fieldMask || DEFAULT_FIELD_MASK;
  const { fieldMask: _, ...body } = req.body;

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
      'X-Goog-FieldMask': fieldMask
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
