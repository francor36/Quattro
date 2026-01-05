import { ref, computed, type Ref } from 'vue'

export interface WelcomeSectionConfig {
  title: string
  description: string
  buttonText: string
  images: {
    background: string
    content: string
    fallback?: string
  }
  options?: {
    showScrollIndicator?: boolean
    showDecoration?: boolean
    imageWidth?: number
    imageHeight?: number
  }
}

export function useWelcomeSection(config: WelcomeSectionConfig) {
  // Estado reactivo
  const imageLoaded = ref(true)
  const buttonClicked = ref(false)
  
  // Computed properties
  const imageAlt = computed(() => 
    `Imagen promocional para: ${config.title}`
  )
  
  const buttonAriaLabel = computed(() =>
    `Navegar a ${config.buttonText.toLowerCase()}`
  )
  
  const aspectRatio = computed(() => {
    const { imageWidth = 800, imageHeight = 600 } = config.options || {}
    return (imageHeight / imageWidth) * 100
  })
  
  // Métodos
  const handleImageError = (error: Event): void => {
    imageLoaded.value = false
    console.error('Error cargando imagen en WelcomeSection:', error)
  }
  
  const handleButtonClick = (): { success: boolean; timestamp: Date } => {
    buttonClicked.value = true
    // Aquí puedes agregar analytics, tracking, etc.
    return {
      success: true,
      timestamp: new Date()
    }
  }
  
  const isValidImageUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url)
      return ['http:', 'https:'].includes(parsedUrl.protocol)
    } catch {
      return false
    }
  }
  
  return {
    // Estado
    imageLoaded,
    buttonClicked,
    
    // Computed
    imageAlt,
    buttonAriaLabel,
    aspectRatio,
    
    // Métodos
    handleImageError,
    handleButtonClick,
    isValidImageUrl
  }
}