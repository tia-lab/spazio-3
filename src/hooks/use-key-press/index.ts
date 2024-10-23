interface UseKeyPress {
  key?: string
  callback: () => void
}

const useKeyPress = ({ key = 'Escape', callback }: UseKeyPress) => {
  document.addEventListener('keydown', function (event) {
    if (event.key === key) {
      callback()
    }
  })
}

export default useKeyPress
