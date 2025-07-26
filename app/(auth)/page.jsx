// In the handleSubmit function, change:
router.push('/verify-email');
// To:
router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);