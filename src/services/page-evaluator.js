module.exports = {
  getAlbum: async () => {
    const getAlbumInfo = () => {
      const url = new URL(window.location.href);
      const title = document.title.replace(" - Google Photos", "");
      const key = url.searchParams.get("key");
      const parts = url.pathname.split("/");
      const id = parts[parts.length - 1];

      return {
        id,
        key,
        title,
        url: window.location.href,
        items: [],
      };
    };

    const sleep = async (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const getItems = async () => {
      const lista = [];

      return new Promise(async (resolve) => {
        // La paginación de datos se hace automaticamente,
        // por lo que debemos interceptar las llamadas XHR
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (
          method,
          url,
          async,
          user,
          password
        ) {
          if (url.match(/batchexecute/)) {
            this.addEventListener("load", function () {
              let data = this.responseText.split("\n");
              data = JSON.parse(`${data[3].substring(1)}`);
              data = JSON.parse(data[2]);
              data = data[1];

              lista.push(
                ...[...data].map((item) => {
                  return {
                    id: item[0],
                    url: item[1][0],
                  };
                })
              );
            });
          }
          origOpen.apply(this, arguments);
        };

        // La primera pagina de datos se obtiene desde un script renderizado en el body.
        const scripts = document.querySelectorAll("script[nonce]");
        scripts.forEach((script) => {
          if (script.innerText.startsWith("AF_initDataCallback")) {
            let str = script.innerText.substring(
              20,
              script.innerText.length - 2
            );
            let jsonObj = null;
            eval(`jsonObj = ${str}`);
            if (jsonObj && jsonObj.data[1]) {
              lista.push(
                ...jsonObj.data[1].map((item) => {
                  if (item && item[0] && item[1]) {
                    return {
                      id: item[0],
                      url: item[1][0],
                    };
                  }
                  return null;
                })
              );
            }
          }
        });

        // Cuando detectemos que no se hayan cargado mas elementos a la lista, debemos resolver la promesa
        let last = lista.length;
        let retries = 0;
        while (retries < 5) {
          if (lista.length !== last) {
            last = lista.length;
            retries = 0;
          }
          retries++;
          await sleep(1000);
        }

        resolve(lista.filter((item) => item !== null));
      });
    };

    const album = getAlbumInfo();
    album.items = await getItems();
    return album;
  },
};
