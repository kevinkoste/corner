import { useState } from 'react'
import styles from './profile.module.css'
import { api } from '../../libs/api'

import imageCompression from 'browser-image-compression'
import ClipLoader from 'react-spinners/ClipLoader'
import { DndShadowBox } from '../../components/profile/DndShadowBox'

import {
  useProfileContext,
  updateComponent,
} from '../../context/ProfileContext'

type ImageProps = {
  id: string
  props: any
}

export const EditImage: React.FC<ImageProps> = ({ id, props }) => {
  const { profileState, profileDispatch } = useProfileContext()
  const [uploading, setUploading] = useState(false)

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

    profileDispatch(
      updateComponent({
        id: id,
        type: 'headshot',
        props: {
          image: image,
        },
      })
    )

    await api({
      method: 'post',
      url: `/protect/components`,
      data: {
        components: profileState.components,
      },
    })

    setUploading(false)
  }

  return (
    <div className={styles.imageContainer}>
      <DndShadowBox>
        <img
          className={styles.image}
          // style={{
          //   objectFit: profileState.dnd ? 'cover' : 'contain',
          // }}
          src={process.env.NEXT_PUBLIC_S3_BUCKET + 'large/' + props.image}
        />
        {profileState.editing && !profileState.dnd && (
          <div className={styles.uploadWrapper}>
            {uploading && (
              <ClipLoader
                css={'position: relative; left: -50%; text-align: center;'}
                loading={uploading}
                color={'#333333'}
              />
            )}
            {!uploading && (
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
        )}
      </DndShadowBox>
    </div>
  )
}

// public component
export const Image: React.FC<ImageProps> = ({ props }) => {
  return (
    <div className={styles.containerPublic}>
      <img
        className={styles.image}
        src={process.env.NEXT_PUBLIC_S3_BUCKET + 'large/' + props.image}
      />
    </div>
  )
}
