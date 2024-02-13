import allowedOrigins from './allowedOrigins';

type CorsCallback = (err: Error | null, allow?: boolean) => void;

const corsOptions: {
  origin: (origin: string | undefined, callback: CorsCallback) => void;
  optionsSuccessStatus: number;
} = {
  origin: (origin, callback) => {
    if ((origin && allowedOrigins.indexOf(origin) !== -1) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  optionsSuccessStatus: 200,
};

export default corsOptions;
