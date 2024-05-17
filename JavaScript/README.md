
## Contenido

Este repositorio contiene un contrato inteligente con los siguientes métodos:
### Escritura:
* `set_proyecto`
* `set_completado`
### Lectura:
* `get_proyecto`
* `get_proyectos`

El contrato se encuentra previamente desplegado en la cuenta `jimmymp1379.testnet`. Puedes hacer llamadas al mismo de la siguiente manera:

```sh
near view jimmymp1379.testnet get_proyectos
```

## Uso

### Compilando y desplegando

Lo primero que debemos hacer es instalar las dependencias necesarias para que el proyecto funcione.

```sh
npm install
```

ó

```sh
yarn install
```

Una vez hecho esto, podemos compilar el código.

```sh
npm run build
```

ó

```sh
yarn build
```

El contrato compilado en WebAssembly se guarda en la carpeta `JavaScript/build/`. Ahora solo es necesario desplegarlo en una cuenta de desarrollo.

```sh
near dev-deploy build/contract.wasm
```

### Usando variables de entorno

Una vez compilado y desplegado tu proyecto, vamos a requerir identificar la cuenta neardev. Esta la puedes encontrar en el archivo `JavaScript/neardev/neardev`. Podemos almacenar este contrato en una variable de entorno ejecutando lo siguiente en la consola, y sustituyendo por tu cuenta de desarrollo:

```sh
export CONTRATO=example.testnet
```

Haciendo esto, podemos comprobar que la variable `CONTRATO` tiene almacenada nuestra cuenta dev.

```sh
echo $CONTRATO
```

### Métodos

Lo primero que debemos hacer es registrar al menos un proyecto en el contrato. Para esto utilizamos el método `set_proyecto`. Este método requiere que se pague 1 NEAR para poder ser ejecutado. El método registra a la persona que lo está ejecutando como proyecto.

```sh
near call $CONTRATO set_proyecto '{"nombre":"Proyecto","descripcion":"DescripcionProyecto","monto_total":150}' --accountId example.testnet --amount 1.1
```

Ahora que tenemos al menos 1 participante, podemos utilizar los métodos de lectura. `get_participante` nos traerá la información específica de un participante dependiendo la cuenta que le enviemos como parámetro. Por otro lado, `get_participantes` nos trae la lista de todos los participantes registrados.

```sh
near view $CONTRATO get_proyecto '{"cuenta":"cuenta.testnet"}'
```

```sh
near view $CONTRATO get_proyectos
```

Por último, si queremos marcar como certificado a uno de los participantes registrados, podemos hacer uso del método `set_completado`. Este método tiene una restricción en la que, si tu cuenta no es `jimmymp1379.testnet` especificamente no te permitirá ejecutarlo. Esta es una forma de agregar una restricción a cuentas específicas. Puedes modificar esta cuenta en el código del contrato.

```sh
near call $CONTRATO set_completado'{"cuenta":"cuenta.testnet"}' --accountId example.testnet
```

