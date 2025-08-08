import { PhoneFormatPipe } from './phone-format.pipe';

describe('PhoneFormatPipe', () => {
  let pipe: PhoneFormatPipe;

  beforeEach(() => {
    pipe = new PhoneFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a phone number with the format "country city mid rest"', () => {
    expect(pipe.transform('+3012345678910')).toEqual('+30 123 456 78910');
  });

  it('should handle a phone number with spaces and return the format "country city mid rest"', () => {
    expect(pipe.transform('+3012 345678 910')).toEqual('+30 123 456 78910');
  });

  it('should return empty string if there is no input', () => {
    expect(pipe.transform('')).toBe('');
  });
});
