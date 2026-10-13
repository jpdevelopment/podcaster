import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill de TextEncoder y TextDecoder para React Router y otras librerías
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
