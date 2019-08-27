import { SAVE_JOBCARDS, REMOVE_JOBCARDS, SAVE_OFFLINE_IMAGES, SAVE_OFFLINE_JOBCARD } from './types';

export const saveJobcards = (jobcards) => {
  return {
    type: SAVE_JOBCARDS,
    jobcards: jobcards
  }
}

export const removeJobcards = () => {
  return {
    type: REMOVE_JOBCARDS
  }
}

export const saveOfflineImages = (images, type, jobcard_id, userId) => {
  return {
    type: SAVE_OFFLINE_IMAGES,
    images: images,
    imageType: type,
    jobcard_id: jobcard_id,
    userId: userId
  }
}

export const saveOfflineJobcard = (data, jobcard_id, userId) => {
  return {
    type: SAVE_OFFLINE_JOBCARD,
    jobcard_id: jobcard_id,
    userId: userId,
    data: data
  }
}