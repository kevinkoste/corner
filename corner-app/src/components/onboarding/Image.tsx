import { useState, useEffect } from 'react'
import styles from './onboarding.module.css'

import imageCompression from 'browser-image-compression'
import ClipLoader from 'react-spinners/ClipLoader'

import { api } from '../../libs/api'
import { OnboardingProps } from '../../models/onboarding'

export const Image: React.FC<OnboardingProps> = ({
  onboardingData,
  setOnboardingData,
  setCanContinue,
}) => {
  const [image, setImage] = useState('pg.jpg')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  useEffect(() => {
    // if returning to component, populate input
    if (onboardingData.image !== '') {
      setCanContinue(true)
      setImage(onboardingData.image)
    }
  }, [])

  const handleFileUpload = async (event: any) => {
    setUploading(true)
    const imageFile = event.target.files[0]
    const compressedFile = await imageCompression(imageFile, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 720,
    })
    const formData = new FormData()
    formData.append('file', compressedFile)

    const { data } = await api({
      method: 'post',
      url: `/protect/profile/image`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
    const { image } = data

    setImage(image)
    setOnboardingData({ ...onboardingData, image: image })

    setUploaded(true)

    setUploading(false)
    setCanContinue(true)
  }

  return (
    <div className={styles.container}>
      <h1>Your Image</h1>
      <br />
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src={process.env.NEXT_PUBLIC_S3_BUCKET + 'large/' + image}
        />
        <div className={styles.uploadWrapper}>
          {uploading && (
            <ClipLoader
              css={'position: relative; left: -50%; text-align: center;'}
              loading={uploading}
              color={'#333333'}
            />
          )}
          {!uploading && !uploaded && (
            <label className={styles.uploadButton}>
              Choose Photo
              <input
                className={styles.uploadInput}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
        {!uploading && uploaded && (
          <label className={styles.uploadButtonChange}>
            Change Photo
            <input
              className={styles.uploadInput}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
        )}
      </div>
    </div>
  )
}
