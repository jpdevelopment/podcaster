// DTOS para la petición del top 100

export interface ITunesImageDTO {
  label: string;
}

export interface ITunesEntryDTO {
  id: { attributes: { 'im:id': string } };
  'im:name': { label: string };
  'im:artist': { label: string };
  'im:image': ITunesImageDTO[];
  summary?: { label: string };
}

export interface ITunesTopPodcastsResponseDTO {
  feed: { entry: ITunesEntryDTO[] };
}