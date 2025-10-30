const Notification = ({ message, isError }) => {
  if (!message) return null

  const style = {
    color: isError ? 'red' : 'green',
    background: '#f4f4f4',
    padding: 10,
    border: `2px solid ${isError ? 'red' : 'green'}`,
    borderRadius: 5,
    marginBottom: 10,
  }

  return <div style={style}>{message}</div>
}

export default Notification
