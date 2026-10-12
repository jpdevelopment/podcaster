export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class PodcastFetchError extends DomainError {
  constructor() {
    super('No se pudo obtener el listado de podcasts.');
  }
}

export class PodcastDetailError extends DomainError {
  constructor(id: string) {
    super(`No se pudo obtener el detalle del podcast con ID: ${id}`);
  }
}