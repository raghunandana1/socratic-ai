async function runTests() {
  const baseUrl = 'http://localhost:5001';

  console.log('--- TEST 1: Healthcheck Endpoint ---');
  try {
    const healthRes = await fetch(`${baseUrl}/api/v1/health`);
    const healthData = await healthRes.json();
    console.log('Healthcheck Response:', JSON.stringify(healthData, null, 2));
  } catch (err) {
    console.error('Healthcheck failed:', err.message);
    process.exit(1);
  }

  console.log('\n--- TEST 2: Text Doubt Diagnosis Endpoint ---');
  try {
    const formData = new FormData();
    formData.append('exam', 'JEE Advanced');
    formData.append('subject', 'Mathematics');
    formData.append('class', '12');
    formData.append('chapter', 'Definite Integration');
    formData.append('subtopic', "King's Property");
    formData.append('errorTag', 'Conceptual Blindspot');
    formData.append('questionText', 'How do I evaluate integral 0 to pi/2 of sin(x)/(sin(x)+cos(x)) dx?');

    const diagRes = await fetch(`${baseUrl}/api/v1/doubts/diagnose`, {
      method: 'POST',
      body: formData
    });
    const diagData = await diagRes.json();
    console.log('Diagnosis Response:', JSON.stringify(diagData, null, 2));

    if (diagData.success && diagData.data?.diagnosis?.hints?.length === 3) {
      console.log('\n✅ All automated backend verification tests passed!');
    } else {
      console.error('\n❌ Diagnosis response schema validation failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Doubt diagnosis test failed:', err.message);
    process.exit(1);
  }
}

runTests();
