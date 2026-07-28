export class ValidacionUtil {
  static esTextoValido(texto: string): boolean {
    return texto !== undefined && texto !== null && texto.trim().length > 0;
  }

  static esCorreoValido(correo: string): boolean {
    if (!this.esTextoValido(correo)) return false;
    const regexCorreoDominio = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;
    return regexCorreoDominio.test(correo.trim());
  }

  static esContraseniaValida(pass: string): boolean {
    return this.esTextoValido(pass) && pass.trim().length > 6;
  }

  static esRolValido(rol: string): boolean {
    const rolesPermitidos = ['ciudadano', 'institucion', 'admin'];
    return this.esTextoValido(rol) && rolesPermitidos.includes(rol.trim().toLowerCase());
  }

  static esNumeroEnRango(valor: string | number, min: number, max: number): boolean {
    const num = Number(valor);
    return !isNaN(num) && Number.isInteger(num) && num >= min && num <= max;
  }
}