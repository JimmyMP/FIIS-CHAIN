import { NearBindgen, NearPromise, UnorderedMap, near, call, assert, view } from 'near-sdk-js';
import { ONE_NEAR } from 'near-sdk-js/lib/types';

//Creamos una clase llamada proyecto
@NearBindgen({})
class Proyecto {
  nombre: string;
  cuenta: string;
  descripcion: string;
  monto_total: number;
  completado: boolean;

  //Inicializamos el objeto
  constructor(nombre: string, cuenta: string, descripcion:string, monto_total: number) {
    this.nombre = nombre;
    this.cuenta = cuenta;
    this.descripcion = descripcion;
    this.monto_total = monto_total;
    this.completado = false;
  }
}

//Creamos la clase principal del contrato
@NearBindgen({})
class StarterContract {
  //Creamos una colección para almacenar información en nuestro contrato.
  proyectos: UnorderedMap<Proyecto> = new UnorderedMap<Proyecto>('p');

  /**
   * Método de ESCRITURA para registrar un nuevo proyecto
   * El comando para utilizarlo en la terminal es:
   *  >> near call $CONTRATO set_proyecto '{"nombre":"Proyecto","descripcion":"DescripcionProyecto","monto_total":150}' --accountId example.testnet --amount 1.1
   *    * $CONTRATO es una variable de entorno que contiene el id de la cuenta del contrato
   * 
   * @param nombre string que requiere el nombre del proyecto
   * @param descripcion string que requiere la descripción del proyecto
   * @param monto_total entero de 32 bits sin signo que requiere el monto total que requiere el proyecto
   * 
   * Es necesario enviarle 1 NEAR (o más) como pago a este método.
   * Como vamos a aceptar pagos con este método, lo marcamos como payableFunction.
   * El método registra la cuenta que firma la tx cómo la cuenta del proyecto registrándose.
   */

  @call({ payableFunction: true })
  set_proyecto({ nombre, descripcion, monto_total }: { nombre: string, descripcion:string, monto_total: number }): void {
    // Si la cuenta ejecutando el comando no es jimmymp1379.testnet, no podrá hacerse ningún cambio.
    assert(near.signerAccountId() == "jimmymp1379.testnet", "No tienes permisos para ejecutar este comando.");

    //Usamos el objeto near para obtener datos de la transacción.
    const cuenta = near.signerAccountId();
    const deposito = near.attachedDeposit();

    //Hacemos validaciones. Queremos que:
    //* No pongan 0 como monto_total, osea que el monto_total sea mayor a 0.
    //* El nombre y descripcion tenga más de 3 caractéres.
    //* Paguen 1 NEAR cada que se registren en el contrato.
    assert(monto_total > 0, "Monto inválido.");
    assert(nombre.length >= 3, "El nombre debe contener 3 o más caractéres.");
    assert(descripcion.length >= 3, "La descripción debe contener 3 o más caractéres.");
    assert(deposito >= ONE_NEAR, "Debes de pagar 1 NEAR para registrarte.");

    //Instanciamos la clase (creamos un objeto) y le mandamos los datos al constructor.
    const proyecto = new Proyecto(nombre, cuenta, descripcion, monto_total);
    
    //Guardamos la información en la blockchain.
    //UnorderedMap requiere una clave y el dato a guardar.
    //Dado a que se requiere una clave única, vamos a usar la cuenta como clave.
    //Para más información consulta: https://docs.near.org/develop/contracts/basics#sdk-collections
    this.proyectos.set(cuenta, proyecto);

    //Le enviamos un mensaje de confirmación a la consola.
    near.log("Proyecto creado exitosamente.");
  }

  /**
   * Método de LECTURA que regresa un proyecto
   * El comando para utilizarlo en la terminal es:
   *  >> near view $CONTRATO get_proyecto '{"cuenta":"CUENTA.NEAR"}'
   * @param cuenta string que contiene la cuenta (key) del usuario a consultar
   */

  @view({})
  get_proyecto({ cuenta }: { cuenta: string }) {
    return this.proyectos.get(cuenta);
  }

  /**
   * Método de LECTURA que regresa toda la lista de los proyectos registrados
   * El comando para utilizarlo en la terminal es:
   *  >> near view $CONTRATO get_proyectos '{}'
   */

  @view({})
  get_proyectos() {
    return this.proyectos.toArray();
  }

  /**
   * Método de ESCRITURA para marcar como completo un proyecto
   * El comando para utilizarlo en la terminal es:
   *  >> near call $CONTRATO set_completado '{"cuenta":"cuenta.near"}' --accountId cuenta.near --amount 1
   * 
   * @param cuenta string que contiene la cuenta del proyecto completado
   */
  @call({})
  set_completado({ cuenta }: { cuenta: string }) {

    //Si la cuenta ejecutando el comando no es jimmymp1379.testnet, no podrá hacerse ningún cambio.
    assert(near.signerAccountId() == "jimmymp1379.testnet", "No tienes permisos para ejecutar este comando.");

    //Buscamos al proyecto. En este caso se declara como let porque vamos a modificarlo.
    let proyecto = this.proyectos.get(cuenta);

    //Necesitamos evaluar si la línea de arriba encontró al proyecto
    if (proyecto && proyecto.completado == false) {
      proyecto.completado = true;

      //Y guardamos los cambios hechos al proyecto
      this.proyectos.set(cuenta, proyecto);
      near.log("Proyecto Completado");

      //Por último, regresamos true indicando que la acción se completó exitosamente.
      return true;
    }
    else if (proyecto && proyecto.completado == true) {
      //Si no encuentra al proyecto, o si este ya está completado
      //regresamos false.
      near.log("El proyecto ya se encontraba completado.");

      return false;
    }
    else {
      near.log("Proyecto no encontrado.");

      return false;
    }
  }
  // Método de ESCRITURA para eliminar un proyecto
  /*
  * El comando para utilizarlo en la terminal es:
   *  >> near call $CONTRATO eliminar_proyecto'{"cuenta":"jimmymp.testnet"}' --accountId jimmymp.testnet
   *    * $CONTRATO es una variable de entorno que contiene el id de la cuenta del contrato
  */
  @call({})
  eliminar_proyecto({ cuenta }: { cuenta: string }): boolean {

      // Si la cuenta ejecutando el comando no es jimmymp.testnet, no podrá hacerse ningún cambio.
      assert(near.signerAccountId() == "jimmymp1379.testnet", "No tienes permisos para ejecutar este comando.");

      // Buscamos al proyecto
      let proyecto = this.proyectos.get(cuenta);

      // Verificamos si encontramos al proyecto y si está completado
      if (proyecto && proyecto.completado) {
          // Eliminamos al proyecto de la lista
          this.proyectos.remove(cuenta);
          near.log("Proyecto eliminado exitosamente.");
          return true;
      } else {
          // Si el proyecto no existe o no está completado, regresamos false
          near.log("No se puede eliminar el proyecto.");
          return false;
      }
  }
}