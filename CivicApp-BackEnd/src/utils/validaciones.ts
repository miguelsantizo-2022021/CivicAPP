export class ValidacionUtil {
  // Valida que un texto no venga vacío ni con puros espacios
  static esTextoValido(texto: string): boolean {
    return texto !== undefined && texto !== null && texto.trim().length > 0;
  }

  // Valida formato de correo básico
  static esCorreoValido(correo: string): boolean {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo.trim());
  }

  // Valida que la contraseña tenga una longitud mínima (ej: 4 caracteres)
  static esContraseniaValida(pass: string): boolean {
    return pass.trim().length >= 4;
  }

  // Valida que el valor ingresado sea un número entero positivo dentro de un rango
  static esNumeroEnRango(valor: string, min: number, max: number): boolean {
    const num = Number(valor);
    return !isNaN(num) && Number.isInteger(num) && num >= min && num <= max;
  }
}